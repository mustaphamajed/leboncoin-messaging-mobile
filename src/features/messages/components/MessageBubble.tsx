import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { colors, formatTime } from '@/lib';
import type { DeliveryStatus } from '../types';

interface MessageBubbleProps {
  body: string;
  timestamp: number;
  authorName: string;
  isOwn: boolean;
  showAuthor: boolean;
  status?: DeliveryStatus;
  onRetry?: () => void;
  onDiscard?: () => void;
}

const statusConfig: Record<DeliveryStatus, { bubbleStyle?: ViewStyle; label?: string }> = {
  sent: {},
  sending: { bubbleStyle: { opacity: 0.7 }, label: 'Envoi…' },
  waiting: { bubbleStyle: { opacity: 0.7 }, label: 'En attente de connexion…' },
  failed: { bubbleStyle: { borderWidth: 2, borderColor: colors.danger } },
};

export function MessageBubble({
  body,
  timestamp,
  authorName,
  isOwn,
  showAuthor,
  status = 'sent',
  onRetry,
  onDiscard,
}: MessageBubbleProps) {
  const { bubbleStyle, label } = statusConfig[status];
  const time = formatTime(timestamp);

  return (
    <View style={[styles.container, isOwn ? styles.containerOwn : styles.containerOther]}>
      {/* The retry and delete buttons stay outside the accessible group so screen readers can reach them. */}
      <View
        accessible
        accessibilityLabel={`${isOwn ? 'Vous' : authorName} : ${body}${status === 'sent' ? `, ${time}` : ''}`}
        style={isOwn ? styles.containerOwn : styles.containerOther}
      >
        {showAuthor && <Text style={styles.author}>{authorName}</Text>}
        <View style={[styles.bubble, isOwn ? styles.bubbleOwn : styles.bubbleOther, bubbleStyle]}>
          <Text style={isOwn ? styles.bodyOwn : styles.bodyOther}>{body}</Text>
        </View>
        {status === 'sent' && <Text style={styles.meta}>{time}</Text>}
      </View>

      {label && <Text style={styles.meta}>{label}</Text>}

      {status === 'failed' && (
        <View style={styles.failed}>
          <Text style={styles.failedText}>Non envoyé.</Text>
          <Pressable accessibilityRole="button" onPress={onRetry} hitSlop={8}>
            <Text style={styles.action}>Renvoyer</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={onDiscard} hitSlop={8}>
            <Text style={styles.action}>Supprimer</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: '80%',
  },
  containerOwn: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  containerOther: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  author: {
    marginBottom: 4,
    paddingHorizontal: 12,
    fontSize: 12,
    color: colors.textMuted,
  },
  bubble: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  bubbleOwn: {
    borderBottomRightRadius: 4,
    backgroundColor: colors.bubbleOwn,
  },
  bubbleOther: {
    borderBottomLeftRadius: 4,
    backgroundColor: colors.bubbleOther,
  },
  bodyOwn: {
    fontSize: 16,
    color: colors.white,
  },
  bodyOther: {
    fontSize: 16,
    color: colors.text,
  },
  meta: {
    marginTop: 4,
    paddingHorizontal: 4,
    fontSize: 12,
    color: colors.textSubtle,
  },
  failed: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
    paddingHorizontal: 4,
  },
  failedText: {
    fontSize: 12,
    color: colors.danger,
  },
  action: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.danger,
  },
});
