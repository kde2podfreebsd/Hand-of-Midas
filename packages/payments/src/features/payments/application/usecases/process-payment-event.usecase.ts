import { UUIDv4 } from '@common/types';
import { prisma } from '@infrastructure/prisma';
import { Injectable } from '@nestjs/common';
import { TransactionStatus } from '@prisma/client';
import { Transactional } from '@transactional/core';
import { randomUUID } from 'crypto';
import {
  PaymentEvent,
  ProcessPaymentEventRequest,
} from '../dto/request/process-payment-event.request';

@Injectable()
export class ProcessPaymentEventUsecase {
  @Transactional()
  public async execute(request: ProcessPaymentEventRequest): Promise<void> {
    const status = this.mapEventToStatus(request.event);

    await this.updateStatus(request.object.id, status);

    if (status === TransactionStatus.success) {
      await this.createDeposit(request.object.id);
    }
  }

  private async updateStatus(
    operationId: UUIDv4,
    status: TransactionStatus,
  ): Promise<void> {
    await prisma.depositOperation.update({
      where: { id: operationId },
      data: { status },
    });
  }

  private async createDeposit(operationId: UUIDv4): Promise<void> {
    const operation = await prisma.depositOperation.findFirstOrThrow({
      where: { id: operationId },
    });

    await prisma.deposit.create({
      data: {
        id: randomUUID(),
        userId: operation.userId,
        operationId: operation.id,
        amount: operation.amount,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  private mapEventToStatus(event: PaymentEvent): TransactionStatus {
    const mapper: Record<PaymentEvent, TransactionStatus> = {
      [PaymentEvent.Success]: TransactionStatus.success,
      [PaymentEvent.Close]: TransactionStatus.cancel,
    };

    return mapper[event];
  }
}
