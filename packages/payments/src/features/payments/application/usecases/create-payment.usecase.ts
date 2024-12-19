import { IPaymentStatus } from '@a2seven/yoo-checkout';
import { Model } from '@common/domain/model';
import { DomainError, ErrorCase } from '@common/errors';
import { UUIDv4 } from '@common/types';
import { UserModel } from '@features/shared/users/domain/models/user.model';
import { prisma } from '@infrastructure/prisma';
import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { TransactionStatus } from '@prisma/client';
import { Propagation, Transactional } from '@transactional/core';
import {
  CreatePaymentRequest,
  PaymentProvider,
} from '../dto/request/create-payment.request';
import { FakeYookassaService } from '../integrations/yookassa/services/fake-yookassa.service';

@Injectable()
export class CreatePaymentUsecase {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly yookassaService: FakeYookassaService,
  ) {}

  public async execute(
    userId: UUIDv4,
    provider: PaymentProvider,
    request: CreatePaymentRequest,
  ): Promise<string> {
    if (provider !== PaymentProvider.Yookassa) {
      throw new DomainError(ErrorCase.NotFound, 'Unknown payment provider');
    }

    await this.upsertUser(userId);
    const token = await this.createPayment(userId, request);

    return token;
  }

  @Transactional(Propagation.REQUIRES_NEW)
  private async upsertUser(id: UUIDv4): Promise<void> {
    await this.executeCommands(UserModel.create({ id }));
  }

  @Transactional(Propagation.REQUIRES_NEW)
  private async createPayment(
    userId: UUIDv4,
    request: CreatePaymentRequest,
  ): Promise<string> {
    const payment = await this.yookassaService.createPayment(
      request.amount,
      request.currency,
    );

    await prisma.depositOperation.create({
      data: {
        id: payment.id,
        userId,
        status: this.mapStatus(payment.status),
        amount: parseFloat(payment.amount.value),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return payment.confirmation.confirmation_token!;
  }

  @Transactional()
  private async executeCommands(model: Model<unknown>): Promise<void> {
    for (const command of model.exposeCommands()) {
      await this.commandBus.execute(command);
    }
  }

  private mapStatus(status: IPaymentStatus): TransactionStatus {
    const mapper: Record<IPaymentStatus, TransactionStatus> = {
      pending: TransactionStatus.pending,
      waiting_for_capture: TransactionStatus.pending,
      succeeded: TransactionStatus.success,
      canceled: TransactionStatus.cancel,
    };

    return mapper[status];
  }
}
