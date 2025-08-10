module zklogin_move::proof_of_attendance {
    use std::string::{Self, String};
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::clock::{Self, Clock};

    /// Proof of Attendance NFT - issued after zkLogin verification
    struct AttendanceProof has key, store {
        id: UID,
        attendee_address: address,
        event_name: String,
        attendance_time: u64,
        verified_via_zklogin: bool,
    }

    /// Issue attendance proof to user (called after zkLogin success)
    public fun issue_attendance_proof(
        event_name: vector<u8>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let proof = AttendanceProof {
            id: object::new(ctx),
            attendee_address: tx_context::sender(ctx),
            event_name: string::utf8(event_name),
            attendance_time: clock::timestamp_ms(clock),
            verified_via_zklogin: true,
        };
        
        // Transfer the proof NFT to the attendee
        transfer::transfer(proof, tx_context::sender(ctx));
    }

    /// View functions to read attendance data
    public fun get_event_name(proof: &AttendanceProof): String {
        proof.event_name
    }

    public fun get_attendee_address(proof: &AttendanceProof): address {
        proof.attendee_address
    }

    public fun get_attendance_time(proof: &AttendanceProof): u64 {
        proof.attendance_time
    }

    public fun is_verified_via_zklogin(proof: &AttendanceProof): bool {
        proof.verified_via_zklogin
    }
}