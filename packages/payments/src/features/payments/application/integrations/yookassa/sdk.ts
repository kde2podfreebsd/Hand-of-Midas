import { YooCheckout } from '@a2seven/yoo-checkout';
import { randomUUID } from 'crypto';

export const yookassaSdk = new YooCheckout({
  debug: true,
  shopId: randomUUID(),
  secretKey: randomUUID(),
});
