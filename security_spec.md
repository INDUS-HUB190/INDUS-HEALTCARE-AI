# INDUS Security Specification

## Data Invariants
1. Users can only read and write their own profile data.
2. Users can only read their own bookmarks, chats, and search history.
3. Users can only create their own bookmarks, chats, and search history.
4. Medicines collection is read-only for public users, but writable by admins.
5. Analytics can only be read by admins.
6. Identity fields (userId, uid) must match the authenticated user.
7. Timestamps must be validated against `request.time`.

## The Dirty Dozen Payloads (Rejection Targets)
1. Write to another user's profile.
2. Read another user's chats.
3. Update a medicine document as a non-admin.
4. Create a chat session with a false `userId`.
5. Inject a 1MB string into a search query.
6. Set `isAdmin` to true in your own profile.
7. Skip `createdAt` in a new bookmark.
8. Delete a medicine document as a regular user.
9. List all users' searches.
10. Update a chat message from another session.
11. Read analytics metadata as a normal user.
12. Create a User document with a mismatched UID.
