---
title: Distributed Systems Notes
---

# Distributed Systems Notes

Core concepts and patterns in distributed computing.

## CAP Theorem

You can only guarantee two of three properties:

1. **Consistency**: Every read receives the most recent write
2. **Availability**: Every request receives a response
3. **Partition Tolerance**: System continues despite network failures

### Practical Implications

In reality, partition tolerance is non-negotiable, so you're choosing between:
- **CP Systems**: Sacrifice availability for consistency (e.g., traditional databases)
- **AP Systems**: Sacrifice consistency for availability (e.g., Cassandra, DynamoDB)

## Consensus Algorithms

### Raft
A more understandable alternative to Paxos:

```
Leader Election:
1. Nodes start as followers
2. If no heartbeat received, become candidate
3. Request votes from other nodes
4. Majority wins, becomes leader

Log Replication:
1. Leader receives client requests
2. Appends to local log
3. Replicates to followers
4. Commits when majority acknowledge
```

### Key Properties
- **Safety**: Never returns incorrect result
- **Liveness**: Eventually makes progress (assuming majority available)

## Consistency Models

| Model | Description | Example |
|-------|-------------|---------|
| Strong | Reads always see latest write | Spanner |
| Eventual | Reads eventually see latest write | DynamoDB |
| Causal | Respects causality relationships | MongoDB |
| Read-your-writes | See your own writes immediately | Session consistency |

## Distributed Transactions

### Two-Phase Commit (2PC)

**Phase 1 - Prepare:**
- Coordinator asks all participants to prepare
- Participants acquire locks, write to log
- Vote yes/no

**Phase 2 - Commit/Abort:**
- If all vote yes: commit
- If any vote no: abort
- Participants execute decision

### Saga Pattern
For long-running transactions:
```
T1 -> T2 -> T3 -> ... -> Tn
C1 <- C2 <- C3 <- ... <- Cn (compensating transactions)
```

## Failure Modes

1. **Crash failures**: Node stops responding
2. **Omission failures**: Messages lost
3. **Byzantine failures**: Node behaves arbitrarily (malicious or buggy)

## Key Takeaways

- Distributed systems are about **trade-offs**
- Design for **failure** as the normal case
- **Idempotency** is your friend
- **Observability** is critical

---

*Further reading: Designing Data-Intensive Applications by Martin Kleppmann*
