import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useCurrentUserId } from '@/context';
import { colors } from '@/lib';
import { MESSAGE_MAX_LENGTH } from '@/services';
import { useSendMessage } from '../hooks/useSendMessage';

const COUNTER_THRESHOLD = 100;

interface MessageComposerProps {
  conversationId: number;
  recipientName: string;
}

export function MessageComposer({ conversationId, recipientName }: MessageComposerProps) {
  const currentUserId = useCurrentUserId();
  const { mutate: sendMessage } = useSendMessage(conversationId);
  const [body, setBody] = useState('');
  const trimmedBody = body.trim();
  const remaining = MESSAGE_MAX_LENGTH - body.length;
  const showCounter = remaining <= COUNTER_THRESHOLD;

  const handleSend = () => {
    if (trimmedBody) {
      sendMessage({ conversationId, authorId: currentUserId, body: trimmedBody });
      setBody('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.field}>
        <TextInput
          accessibilityLabel={`Message à ${recipientName}`}
          value={body}
          onChangeText={setBody}
          multiline
          maxLength={MESSAGE_MAX_LENGTH}
          placeholder="Écrire un message"
          placeholderTextColor={colors.textSubtle}
          style={styles.input}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Envoyer le message"
          accessibilityState={{ disabled: !trimmedBody }}
          disabled={!trimmedBody}
          onPress={handleSend}
        >
          {({ pressed }) => (
            <View style={[styles.send, pressed && styles.sendPressed, !trimmedBody && styles.sendDisabled]}>
              <Text style={styles.sendIcon}>↑</Text>
            </View>
          )}
        </Pressable>
      </View>
      {showCounter && (
        <Text accessibilityLiveRegion="polite" style={styles.counter}>
          {remaining} caractères restants
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    paddingVertical: 4,
    paddingLeft: 16,
    paddingRight: 4,
  },
  input: {
    flex: 1,
    maxHeight: 160,
    minHeight: 36,
    paddingVertical: 8,
    fontSize: 16,
    color: colors.text,
  },
  send: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9999,
    backgroundColor: colors.brand,
  },
  sendPressed: {
    backgroundColor: colors.brandDark,
  },
  sendDisabled: {
    backgroundColor: colors.disabled,
  },
  sendIcon: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
  },
  counter: {
    marginTop: 4,
    paddingHorizontal: 16,
    textAlign: 'right',
    fontSize: 12,
    color: colors.textMuted,
  },
});
