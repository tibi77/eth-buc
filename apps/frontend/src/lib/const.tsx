export const languageOptions = [
    { value: "ar", label: "Arabic", icon: () => "🇸🇦" },
    { value: "zh", label: "Chinese", icon: () => "🇨🇳" },
    { value: "en", label: "English", icon: () => "🇬🇧" },
    { value: "fr", label: "French", icon: () => "🇫🇷" },
    { value: "de", label: "German", icon: () => "🇩🇪" },
    { value: "hi", label: "Hindi", icon: () => "🇮🇳" },
    { value: "it", label: "Italian", icon: () => "🇮🇹" },
    { value: "ja", label: "Japanese", icon: () => "🇯🇵" },
    { value: "ko", label: "Korean", icon: () => "🇰🇷" },
    { value: "pt", label: "Portuguese", icon: () => "🇵🇹" },
    { value: "ro", label: "Romanian", icon: () => "🇷🇴" },
    { value: "ru", label: "Russian", icon: () => "🇷🇺" },
    { value: "es", label: "Spanish", icon: () => "🇪🇸" },
    { value: "tr", label: "Turkish", icon: () => "🇹🇷" },
];

// https://github.com/diragb/shadcn-dropzone?tab=readme-ov-file

export const companyHumanInfo = [
    {
        name: "name",
        label: "Name",
        type: "text",
        placeholder: "Name",
    },
    {
        name: "priority",
        label: "Priority",
        type: "singleSelect",
        options: ["Low", "Medium", "High"],
        placeholder: "Priority",
    },
    {
        name: "phone_number",
        label: "971 550 000 000",
        type: "text",
        placeholder: "Phone",
    },
    {
        name: "context",
        label: "Human Context",
        type: "text",
        placeholder: "Human Context",
    }
] as const;

export const integrationTrigger = [
    {
        name: "button_text",
        label: "Button Text",
        type: "text",
        placeholder: "Button Text",
    },
    {
        name: "identifier",
        label: "Agent Identifier",
        type: "text",
        placeholder: "Agent Identifier",
    },
    {
        name: "context",
        label: "Agent Context",
        type: "text",
        placeholder: "Agent Context",
    },
    {
        name: "additional_info",
        label: "Agent Additional Info",
        type: "text",
        placeholder: "Agent Additional Info",
    },
    {
        name: "button_index",
        label: "Button Index",
        type: "number",
        placeholder: "Button Index",
    },
] as const;


export const escalation_contacts_keys = companyHumanInfo.map(({ name }) => name);
export const integration_triggers_keys = integrationTrigger.map(({ name }) => name);

export const formFields = [
    {
        name: "website",
        label: "Website",
        type: "text",
        placeholder: "Website",
    },
    {
        name: 'bot_name',
        label: 'Bot Name',
        type: 'text',
        placeholder: 'Bot Name'
    },
    {
        name: "scope",
        label: "Agent Scope",
        type: "text",
        placeholder: "Agent Scope",
    },
    {
        name: "integration_triggers",
        label: '',
        type: "subForm",
        subForm: integrationTrigger
    },
    {
        name: "initial_message",
        label: "Agent Initial Message",
        type: "text",
        placeholder: "Agent Initial Message",
    },
    {
        name: "response_languages",
        label: "Response Languages",
        type: "select",
        placeholder: "Response Languages",
        options: languageOptions,
    },
    {
        name: "user_prompt",
        label: "Expert Prompt (corrective reinforcement)",
        type: "textarea",
        placeholder: "Expert Prompt",
    },
    {
        name: "schemaJSON",
        label: "Registration Schema",
        type: "textarea",
        placeholder: "Registration Schema",
    },
    {
        name: "escalate_unresolved_issues",
        label: "Escalate unresolved issues to human",
        type: "checkbox",
        placeholder: "Escalate unresolved issues to human",
    },
    {
        name: "escalation_contacts",
        label: "",
        type: "subForm",
        subForm: companyHumanInfo,
    },
    {
        name: "rag_context",
        label: "Context Documents",
        type: "fileUpload",
    },
    {
        name: "terminate_chat_sequence",
        label: "Terminate Chat Sequence",
        type: "text",
        placeholder: "Terminate Chat Sequence",
    },
    {
        name: "transfer_chat_sequence",
        label: "Transfer Chat Sequence",
        type: "text",
        placeholder: "Transfer Chat Sequence",
    },
    {
        name: "agent_session_timeout",
        label: "Agent Timeout (min)",
        type: "number",
        placeholder: "Agent Timeout (min)",
    },
    {
        name: 'api_token',
        label: 'API Token',
        type: 'text',
        placeholder: 'API Token'
    },
    {
        name: 'wa_number',
        label: 'WhatsApp Number',
        type: 'text',
        placeholder: 'WhatsApp Number'
    },
    {
        name: 'spreadsheetId',
        label: 'Spreadsheet Reference',
        type: 'text',
        placeholder: 'Spreadsheet Reference'
    },
] as const;