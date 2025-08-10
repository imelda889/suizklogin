// CONSTANTS - Your Smart Contract Details
// =============================================================================
export const CONTRACT_CONFIG = {
    PACKAGE_ID: '0x61cfdb727fdaad87fcc160fff3432ae961ee83f99e0b391305a1e1d777d5f07c',
    MODULE_NAME: 'proof_of_attendance',
    CLOCK_OBJECT: '0x6', // Sui system clock
    NETWORK: 'testnet'
};

// =============================================================================
// REQUIRED DEPENDENCIES (UI teammate needs to install)
// =============================================================================
/*
npm install @mysten/sui @mysten/enoki @mysten/dapp-kit
*/

// =============================================================================
// IMPORTS (UI teammate adds these to their project)
// =============================================================================
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';

// Initialize Sui client
const suiClient = new SuiClient({ 
    url: getFullnodeUrl(CONTRACT_CONFIG.NETWORK) 
});

// =============================================================================
// MAIN INTEGRATION FUNCTIONS
// =============================================================================

/**
 * Issue Attendance Proof - Call this AFTER zkLogin success
 * @param {string} eventName - Name of the event (e.g., "DevMatch 2025")
 * @param {object} userSigner - Signer from zkLogin authentication
 * @returns {Promise<object>} Transaction result
 */
export async function issueAttendanceProof(eventName, userSigner) {
    try {
        console.log('🎫 Creating attendance proof for:', eventName);
        
        // Create transaction
        const tx = new Transaction();
        
        // Call your smart contract
        tx.moveCall({
            target: `${CONTRACT_CONFIG.PACKAGE_ID}::${CONTRACT_CONFIG.MODULE_NAME}::issue_attendance_proof`,
            arguments: [
                tx.pure.string(eventName),
                tx.object(CONTRACT_CONFIG.CLOCK_OBJECT)
            ]
        });
        
        // Execute transaction
        const result = await suiClient.signAndExecuteTransaction({
            signer: userSigner,
            transaction: tx,
            options: {
                showEffects: true,
                showObjectChanges: true,
            }
        });
        
        console.log('✅ Attendance proof created successfully!', result.digest);
        return {
            success: true,
            transactionHash: result.digest,
            data: result
        };
        
    } catch (error) {
        console.error('❌ Error creating attendance proof:', error);
        return {
            success: false,
            error: error.message,
            details: error
        };
    }
}

/**
 * Get User's Attendance Proofs - Call this to display user's NFTs
 * @param {string} userAddress - User's wallet address from zkLogin
 * @returns {Promise<Array>} Array of attendance proof objects
 */
export async function getUserAttendanceProofs(userAddress) {
    try {
        console.log('📋 Loading attendance proofs for:', userAddress);
        
        const objects = await suiClient.getOwnedObjects({
            owner: userAddress,
            filter: {
                StructType: `${CONTRACT_CONFIG.PACKAGE_ID}::${CONTRACT_CONFIG.MODULE_NAME}::AttendanceProof`
            },
            options: {
                showContent: true,
                showType: true
            }
        });
        
        // Parse and format the proofs
        const formattedProofs = objects.data.map(obj => {
            if (obj.data?.content?.fields) {
                const fields = obj.data.content.fields;
                return {
                    objectId: obj.data.objectId,
                    eventName: fields.event_name,
                    attendeeAddress: fields.attendee_address,
                    attendanceTime: new Date(parseInt(fields.attendance_time)),
                    verifiedViaZkLogin: fields.verified_via_zklogin,
                    rawData: fields
                };
            }
            return null;
        }).filter(Boolean);
        
        console.log(`✅ Found ${formattedProofs.length} attendance proofs`);
        return formattedProofs;
        
    } catch (error) {
        console.error('❌ Error loading attendance proofs:', error);
        return [];
    }
}

/**
 * Check if user has specific event proof
 * @param {string} userAddress - User's wallet address
 * @param {string} eventName - Event name to check
 * @returns {Promise<boolean>} True if user has proof for this event
 */
export async function hasEventProof(userAddress, eventName) {
    try {
        const proofs = await getUserAttendanceProofs(userAddress);
        return proofs.some(proof => proof.eventName === eventName);
    } catch (error) {
        console.error('❌ Error checking event proof:', error);
        return false;
    }
}

/**
 * Get user's SUI balance - Check if user has enough gas for transactions
 * @param {string} userAddress - User's wallet address
 * @returns {Promise<object>} Balance information
 */
export async function getUserBalance(userAddress) {
    try {
        const balance = await suiClient.getBalance({ owner: userAddress });
        return {
            total: parseInt(balance.totalBalance),
            formatted: (parseInt(balance.totalBalance) / 1000000000).toFixed(4) + ' SUI',
            hasEnoughForTx: parseInt(balance.totalBalance) > 10000000 // ~0.01 SUI
        };
    } catch (error) {
        console.error('❌ Error getting balance:', error);
        return { total: 0, formatted: '0 SUI', hasEnoughForTx: false };
    }
}

// =============================================================================
// INTEGRATION EXAMPLES FOR UI TEAMMATE
// =============================================================================

/**
 * Example: Complete flow after zkLogin success
 */
export async function handleSuccessfulLogin(userSigner, userAddress, eventName = 'DevMatch 2025') {
    try {
        // 1. Check if user already has this event proof
        const alreadyHasProof = await hasEventProof(userAddress, eventName);
        if (alreadyHasProof) {
            return {
                success: true,
                message: 'User already has proof for this event',
                action: 'skip'
            };
        }
        
        // 2. Check balance
        const balance = await getUserBalance(userAddress);
        if (!balance.hasEnoughForTx) {
            return {
                success: false,
                message: 'Insufficient balance. Please get testnet tokens from https://faucet.sui.io',
                action: 'needTokens'
            };
        }
        
        // 3. Create attendance proof
        const result = await issueAttendanceProof(eventName, userSigner);
        
        if (result.success) {
            return {
                success: true,
                message: 'Attendance proof created successfully!',
                transactionHash: result.transactionHash,
                action: 'created'
            };
        } else {
            return {
                success: false,
                message: 'Failed to create attendance proof: ' + result.error,
                action: 'error'
            };
        }
        
    } catch (error) {
        return {
            success: false,
            message: 'Unexpected error: ' + error.message,
            action: 'error'
        };
    }
}

/**
 * Example: Load and format proofs for display
 */
export async function getFormattedProofsForUI(userAddress) {
    const proofs = await getUserAttendanceProofs(userAddress);
    
    return proofs.map(proof => ({
        id: proof.objectId,
        title: proof.eventName,
        date: proof.attendanceTime.toLocaleDateString(),
        time: proof.attendanceTime.toLocaleTimeString(),
        verified: proof.verifiedViaZkLogin,
        address: `${proof.attendeeAddress.slice(0, 6)}...${proof.attendeeAddress.slice(-4)}`,
        fullAddress: proof.attendeeAddress,
        timestamp: proof.attendanceTime.getTime()
    }));
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Validate user inputs
 */
export function validateEventName(eventName) {
    if (!eventName || typeof eventName !== 'string') {
        return { valid: false, error: 'Event name is required' };
    }
    if (eventName.trim().length < 3) {
        return { valid: false, error: 'Event name must be at least 3 characters' };
    }
    return { valid: true };
}

/**
 * Format transaction hash for display
 */
export function formatTxHash(hash) {
    return `${hash.slice(0, 8)}...${hash.slice(-8)}`;
}

// =============================================================================
// EXPORT ALL FUNCTIONS

export default {
    CONTRACT_CONFIG,
    issueAttendanceProof,
    getUserAttendanceProofs,
    hasEventProof,
    getUserBalance,
    handleSuccessfulLogin,
    getFormattedProofsForUI,
    validateEventName,
    formatTxHash
};