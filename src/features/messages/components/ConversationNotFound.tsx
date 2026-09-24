import { EmptyState, TextLink } from '@/components';

export function ConversationNotFound() {
  return (
    <EmptyState
      title="Conversation introuvable"
      description="Cette conversation n’existe pas ou le lien est invalide."
      action={
        <TextLink href="/" dismissTo>
          Retour aux conversations
        </TextLink>
      }
    />
  );
}
