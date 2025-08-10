# 🎫 Proof of Attendance - Sui zkLogin System

## 📋 Project Overview

**Proof of Attendance** is a decentralized event verification system built on the Sui blockchain that revolutionizes how we track and verify event participation. By leveraging zkLogin technology, attendees can seamlessly authenticate using their existing Web2 credentials (Google, Facebook) while receiving tamper-proof NFT certificates stored on Sui blockchain.

### 🎯 Sui DevMatch 2025 Hackathon Submission
**Track 1: zkLogin Application (Moderate Difficulty)**

**Problem Solved:** Traditional event attendance tracking relies on centralized systems, paper certificates, or easily forgeable digital badges. Our solution provides cryptographically secure, verifiable proof of attendance that attendees own forever.

---

## 🌟 Key Features

### Core Functionality
- **🔐 Seamless zkLogin Authentication**: Login with Google/Facebook - no seed phrases needed
- **🎫 Immutable Proof Generation**: NFT certificates minted on Sui blockchain upon verification
- **⚡ Sub-second Finality**: Instant proof creation leveraging Sui's high-performance architecture
- **📱 Mobile-Friendly Interface**: Responsive design for on-the-go event check-ins
- **🔍 Proof Portfolio**: View all your attendance certificates in one dashboard
- **⛽ Gas Efficient**: Optimized Move smart contracts minimize transaction costs

### Innovation Highlights
- **Privacy-First**: zkLogin preserves user privacy while ensuring verification
- **Interoperable**: NFT proofs work across the entire Sui ecosystem
- **Scalable**: Built for events of any size using Sui's parallel execution
- **User-Centric**: Attendees own their certificates permanently

---

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend UI   │    │  zkLogin Auth   │    │ Sui Blockchain  │
│                 │    │                 │    │                 │
│ • Event Check-in│◄──►│ • OAuth2 Flow   │◄──►│ • Move Contract │
│ • Proof Gallery │    │ • JWT Validation│    │ • NFT Minting   │
│ • Mobile UI     │    │ • ZK Generation │    │ • Object Store  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         ▲                       ▲                       ▲
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 ▼
                    ┌─────────────────────────┐
                    │    Proof of Attendance  │
                    │         NFT             │
                    │ • Verifiable Ownership  │
                    │ • Event Metadata        │
                    │ • Timestamp & Address   │
                    └─────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- Sui CLI installed
- Git

### 1. Clone Repository

```bash
git clone https://github.com/your-team/proof-of-attendance-sui
cd proof-of-attendance-sui
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
cd frontend
npm install

# Install required Sui packages
npm install @mysten/sui @mysten/enoki @mysten/dapp-kit
```

### 3. Configure Environment

Create `.env` file in project root:

```env
# Smart Contract Configuration
REACT_APP_PACKAGE_ID=0x61cfdb727fdaad87fcc160fff3432ae961ee83f99e0b391305a1e1d777d5f07c
REACT_APP_NETWORK=testnet
REACT_APP_COUNTER_OBJECT=your_counter_object_id

# zkLogin Configuration  
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
REACT_APP_REDIRECT_URL=http://localhost:3000/auth

# Sui Network
REACT_APP_SUI_RPC=https://fullnode.testnet.sui.io:443
```

### 4. Start Development Server

```bash
npm start
```

Visit `http://localhost:3000` to see the application.

---

## 📁 Project Structure

```
proof-of-attendance-sui/
├── 📂 contracts/                 # Move Smart Contracts
│   ├── 📂 sources/
│   │   └── proof_of_attendance.move
│   └── Move.toml
├── 📂 frontend/                  # React Application
│   ├── 📂 src/
│   │   ├── 📂 components/
│   │   │   ├── LoginButton.js
│   │   │   ├── ProofGallery.js
│   │   │   └── EventCheckIn.js
│   │   ├── 📂 utils/
│   │   └── App.js
│   └── package.json
├── 📂 zklogin/                   # Authentication Layer
│   ├── zkauth.js
│   └── config.js
├── 📂 integration/               # Sui Integration
│   ├── SuiIntegrateUi.js
│   └── constants.js
├── 📂 demo/                      # Demo Materials
│   ├── demo-video.mp4
│   └── screenshots/
└── README.md
```

---

## 💻 Smart Contract: `proof_of_attendance.move`

Our Move smart contract is the heart of the system, designed for security and efficiency.

### Core Contract Structure

```move
struct AttendanceProof has key, store {
    id: UID,
    attendee_address: address,
    event_name: String,
    attendance_time: u64,
    verified_via_zklogin: bool,
}
```

### Key Functions

#### `issue_attendance_proof()`
```move
public fun issue_attendance_proof(
    event_name: vector<u8>,
    clock: &Clock,
    ctx: &mut TxContext
)
```
**Purpose**: Issues NFT proof after successful zkLogin verification
**Security**: Input validation, timestamp verification, single issuance per event

#### View Functions
- `get_event_name()` - Retrieve event information
- `get_attendee_address()` - Get attendee's Sui address  
- `get_attendance_time()` - Access timestamp data
- `is_verified_via_zklogin()` - Confirm zkLogin verification

### Contract Innovations
- **Gas Optimized**: Minimal storage footprint
- **Event Emission**: On-chain events for easy indexing
- **Input Validation**: Prevents invalid data entry
- **Sui Object Model**: Leverages Sui's unique architecture

---

## 🔐 zkLogin Integration

### Authentication Flow

1. **OAuth Initiation**: User clicks login button
2. **Provider Authentication**: Redirect to Google/Facebook/etc.
3. **JWT Processing**: Receive and validate JWT token
4. **zkProof Generation**: Create zero-knowledge proof
5. **Sui Address Derivation**: Generate Sui address from proof
6. **Transaction Signing**: Enable transaction signing capability

### Supported Providers

- ✅ Google OAuth 2.0
- ✅ Facebook Login
- ⚠️ Apple Sign-In (coming soon)
- ⚠️ Discord OAuth (coming soon)

---

## 🎨 User Interface

### Key Components

- **🏠 Landing Page**: Project introduction and login CTA
- **🔑 Authentication Modal**: zkLogin flow interface
- **📊 Dashboard**: User's attendance proof gallery
- **🎫 Proof Details**: Individual proof information view
- **⚙️ Settings**: Account management and preferences

### Design Features

- **Responsive Design**: Mobile-first approach
- **Dark/Light Mode**: Theme switching capability
- **Loading States**: Smooth user experience during blockchain interactions
- **Error Handling**: User-friendly error messages and recovery options

---

## 🧪 Testing

### Unit Tests
```bash
cd contracts
sui move test
```

### Integration Tests
```bash
cd frontend
npm test
```

### End-to-End Testing
```bash
npm run test:e2e
```

### Manual Testing Checklist

- [ ] zkLogin authentication flow
- [ ] NFT proof generation
- [ ] Proof display and verification
- [ ] Error handling scenarios
- [ ] Mobile responsiveness
- [ ] Cross-browser compatibility

---

## 🚀 Deployment

### Smart Contract Deployment

1. **Configure Sui CLI**:
```bash
sui client switch --env testnet
sui client active-address
```

2. **Deploy Contract**:
```bash
cd contracts
sui client publish --gas-budget 100000000
```

3. **Save Deployment Info**:
   - Package ID
   - ProofCounter Object ID
   - Update configuration files

### Frontend Deployment

```bash
# Build production bundle
npm run build

# Deploy to hosting service
# (Vercel, Netlify, etc.)
```

---

## 📊 Demo & Usage

### Live Demo
🔗 **[Try Proof of Attendance Demo](https://proof-of-attendance-sui.vercel.app)**

### Demo Video
🎥 **[5-Minute Walkthrough - DevMatch 2025](https://your-demo-video-link)**

### Try It Yourself

1. **Visit our demo app**
2. **Click "Verify Attendance"** 
3. **Login with Google/Facebook** (zkLogin)
4. **Receive your NFT proof** instantly
5. **View in your proof gallery**

```javascript
// Example: After zkLogin success
const attendanceResult = await issueAttendanceProof(
    'DevMatch 2025 Hackathon',
    userSigner
);

// User receives NFT proof with metadata:
// - Event: "DevMatch 2025 Hackathon"  
// - Timestamp: 2025-08-09T14:30:00Z
// - Verified: true (via zkLogin)
// - Owner: 0x1a2b3c... (user's Sui address)
```

---

## 🛣️ Roadmap

### Phase 1: Core Features ✅
- [x] Basic zkLogin integration
- [x] Smart contract development  
- [x] NFT proof generation
- [x] Frontend interface

### Phase 2: Enhanced Features 🚧
- [ ] Multi-event support
- [ ] Advanced analytics dashboard
- [ ] Proof sharing capabilities
- [ ] Mobile app development

### Phase 3: Enterprise Features 📋
- [ ] Organization management
- [ ] Bulk operations
- [ ] API for third-party integration
- [ ] Advanced security features

---

### Development Setup

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🏆 Hackathon Submission - DevMatch 2025

### 📋 Submission Details
**Track**: Track 1 - zkLogin Application (Moderate Difficulty)  
**Team Name**: [Yaleyale]  
**Submission Date**: August 10, 2025

### 👥 Team Members
- **[Hiew Yi Hwa]** - *Smart Contract Developer*
  - Move programming & contract architecture
  - Sui blockchain integration & optimization
  - Gas efficiency & security implementation

- **[Chong Xin Yi]** - *zkLogin Integration Developer*  
  - OAuth flow implementation
  - JWT handling & validation
  - Zero-knowledge proof generation

- **[Hwomg Yong Bing]** - *Frontend Developer*
  - React UI/UX development  
  - Mobile-responsive design
  - Handle wallet connection UI

- **[Ng Xue Qi]** - *Frontend Lead & Auth Integration*
  - React UI/UX development  
  - Mobile-responsive design
  - Implement frontend integration for zkLogin authentication 
  - Frontend error handling & form validation

### ✅ Submission Requirements Met
- ✅ **GitHub Repository**: Complete open-source codebase
- ✅ **Technical Documentation**: Comprehensive README & code comments
- ✅ **5-Minute Demo Video**: Full system walkthrough
- ✅ **zkLogin Integration**: Core requirement implemented
- ✅ **Real-world Use Case**: Event attendance verification
- ✅ **Security Standards**: Input validation & error handling
- ✅ **Sui-Specific Features**: Move language, object model, parallel execution

### 🎯 Judging Criteria Alignment

**Idea/Concept (25%)**
- ✅ **Real Need**: Solves actual event verification problems
- ✅ **Innovation**: First zkLogin-based attendance system  
- ✅ **Clarity**: Clear value proposition and use case

**Product (25%)**
- ✅ **User Experience**: Seamless login-to-proof flow
- ✅ **Design Quality**: Professional, mobile-responsive interface
- ✅ **Completeness**: Fully functional end-to-end system

**Technical Implementation (25%)**
- ✅ **Sui Features**: Move contracts, object model, zkLogin
- ✅ **Architecture**: Sound, secure, efficient design
- ✅ **Code Quality**: Well-documented, tested, maintainable

**"Wow" Factor (25%)**
- ✅ **Innovation**: Novel use of zkLogin for attendance
- ✅ **Professionalism**: Production-ready quality
- ✅ **Impact**: Scalable solution for real-world events

---

## 📞 Support

- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/your-username/sui-zklogin-attendance/issues)
- **Discord**: [Sui Developer Community](https://discord.gg/sui)
- **Email**: your-email@example.com

---

## 🙏 Acknowledgments

- **Sui Foundation** & **Mysten Labs** for the revolutionary blockchain platform and zkLogin technology
- **DevMatch 2025 Organizers** for hosting this incredible hackathon
- **Move Language Community** for excellent documentation and support
- **Web3 Privacy Advocates** for inspiring privacy-preserving solutions

---



