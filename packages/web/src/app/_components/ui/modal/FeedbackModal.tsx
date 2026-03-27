/**
 * [FeedbackModal]
 * Hash-based feedback modal for Sentry error reporting
 * Replaces Sentry's built-in feedbackIntegration UI
 * Usage: openHashModal('feedback')
 * URL: #feedback
 */

'use client';

import { Button, Dialog, IconButton, Text, TextArea, TextField } from '@radix-ui/themes';
import * as Sentry from '@sentry/nextjs';
import { ChangeEvent, FormEvent, useRef, useState } from 'react';

import { Icon } from '@zerogravity/shared/components/ui/icon';

import { useModal } from './_contexts/ModalContext';
import { ModalHeader } from './header/ModalHeader';

/*
 * ============================================
 * Constants
 * ============================================
 */

/** Hash ID for feedback modal */
const FEEDBACK_HASH = 'feedback';

/** Accepted image MIME types */
const ACCEPTED_IMAGE_TYPES = 'image/png,image/jpeg,image/webp';

/** Max file size in bytes (5MB) */
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/*
 * ============================================
 * FeedbackModal Component
 * ============================================
 * Hash-based modal for user feedback
 * Sends feedback to Sentry via captureFeedback API
 * Supports optional screenshot attachment
 */

export function FeedbackModal() {
  /*
   * --------------------------------------------
   * 1. External Hooks
   * --------------------------------------------
   */
  const { currentHashModal, closeModal } = useModal();

  /*
   * --------------------------------------------
   * 2. States
   * --------------------------------------------
   */
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /*
   * --------------------------------------------
   * 3. Derived Values
   * --------------------------------------------
   */
  const isFeedbackModal = currentHashModal === FEEDBACK_HASH;
  const inputSize = '3';
  const buttonSize = '3';

  /*
   * --------------------------------------------
   * 4. Event Handlers
   * --------------------------------------------
   */
  /** Submit feedback to Sentry */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Build attachments from screenshot
    let attachments: { filename: string; data: Uint8Array; contentType: string }[] | undefined;

    if (screenshot) {
      const buffer = await screenshot.arrayBuffer();
      attachments = [
        {
          filename: screenshot.name,
          data: new Uint8Array(buffer),
          contentType: screenshot.type,
        },
      ];
    }

    Sentry.captureFeedback(
      {
        message: message.trim(),
        name: name.trim() || undefined,
        email: email.trim() || undefined,
      },
      attachments ? { attachments } : undefined
    );

    setIsSubmitted(true);
  };

  /** Handle file selection */
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      e.target.value = '';
      return;
    }

    setScreenshot(file);
  };

  /** Remove attached screenshot */
  const handleRemoveScreenshot = () => {
    setScreenshot(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  /** Close modal and reset form state */
  const handleClose = () => {
    closeModal();
    // Reset after close animation
    setTimeout(() => {
      setMessage('');
      setName('');
      setEmail('');
      setScreenshot(null);
      setIsSubmitted(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }, 200);
  };

  /** Handle dialog open change */
  const handleOpenChange = (open: boolean) => {
    if (!open) handleClose();
  };

  /*
   * --------------------------------------------
   * 5. Return
   * --------------------------------------------
   */
  if (!isFeedbackModal) return null;

  return (
    <Dialog.Root open={isFeedbackModal} onOpenChange={handleOpenChange}>
      <Dialog.Content maxWidth="500px" className="max-mobile:!px-5">
        {isSubmitted ? (
          <div className="flex flex-col gap-8 py-2">
            <ModalHeader title="Thank You!" description="Your feedback has been sent successfully." />
            <div className="flex justify-end">
              <Button size={buttonSize} onClick={handleClose}>
                Close
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 py-2">
            <ModalHeader title="Send Feedback" description="What happened? What did you expect?" />

            <div className="flex flex-col gap-4">
              <TextArea
                placeholder="Describe the issue or share your thoughts..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                size={inputSize}
                rows={6}
                required
              />

              <div className="flex flex-col gap-3">
                <TextField.Root
                  placeholder="Name (optional)"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  size={inputSize}
                />
                <TextField.Root
                  placeholder="Email (optional)"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  size={inputSize}
                />
              </div>

              {/* Screenshot attachment */}
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPTED_IMAGE_TYPES}
                  onChange={handleFileChange}
                  className="hidden"
                />
                {screenshot ? (
                  <div className="rounded-2 bg-gray-a3 flex items-center gap-2 px-3 py-2">
                    <Icon size={16}>image</Icon>
                    <Text size="2" className="max-w-48 truncate">
                      {screenshot.name}
                    </Text>
                    <IconButton size="1" variant="ghost" color="gray" type="button" onClick={handleRemoveScreenshot}>
                      <Icon size={16}>close</Icon>
                    </IconButton>
                  </div>
                ) : (
                  <Button
                    variant="soft"
                    color="gray"
                    size="2"
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Icon size={16}>attach_file</Icon>
                    Attach screenshot
                  </Button>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="soft" color="gray" size={buttonSize} type="button" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" size={buttonSize} disabled={!message.trim()}>
                Send
              </Button>
            </div>
          </form>
        )}
      </Dialog.Content>
    </Dialog.Root>
  );
}
