# sanis
The only app your pet needs to thrive.

## Remarks for Ammar (Handover Notes)
The following items are currently pending or blocked and require further configuration or development:

1. **Email Confirmation Issues**: The Supabase confirmation email is not being sent successfully in the current sandbox environment. Consequently, new user accounts cannot be fully verified/created without manual database intervention or SMTP configuration.
2. **Google Login (OAuth)**: Google authentication is currently non-functional as it requires a direct, verified domain for redirect URIs, which is not available in the local/sandbox development setup.
3. **AI RAG Implementation**: The AI-powered RAG (Retrieval-Augmented Generation) response system for specific breed knowledge is currently a skeleton and not fully integrated with a vector database. It currently relies on general LLM knowledge and static breed constants.
4. **Pet Allergy Integration**: Successfully integrated a new `allergies` field into the pet registration flow and the AI analysis prompt. The AI now explicitly checks ingredients against these allergies.
5. **Dynamic Dashboard**: The dashboard date strip and user-specific greetings have been made dynamic to reflect real-time data.
