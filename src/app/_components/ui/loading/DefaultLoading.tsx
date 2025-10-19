'use client';

import { Text } from '@radix-ui/themes';
import { motion } from 'motion/react';

import { Icon } from '../icon';

export default function DefaultLoading() {
  return (
    <motion.div
      initial={{ opacity: 0.3 }}
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ duration: 1.2, ease: 'linear', repeat: Infinity }}
      className="flex items-center justify-center"
    >
      <Text size="5" weight="light" align="center" color="gray" className="flex items-center gap-2">
        <Icon size={24}>rocket_launch</Icon>
        LAUNCHING
      </Text>
    </motion.div>
  );
}
