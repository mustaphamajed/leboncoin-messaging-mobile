import { EmptyState, TextLink } from '@/components';

export default function NotFoundScreen() {
  return (
    <EmptyState
      title="Page introuvable"
      description="La page que vous cherchez n’existe pas."
      action={
        <TextLink href="/" dismissTo>
          Aller aux messages
        </TextLink>
      }
    />
  );
}
