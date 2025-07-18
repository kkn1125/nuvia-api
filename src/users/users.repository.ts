import { BadRequestException } from '@common/dto/response';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isNil } from '@util/isNil';
import { DeepPartial, QueryRunner, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { AlreadyExistsEmailException } from './exception/already-exists-email.exception';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async transactional(callback: (repository: Repository<User>) => Promise<User>): Promise<User> {
    const queryRunner = this.repository.manager.connection.createQueryRunner();
    queryRunner.startTransaction();
    try {
      const result = await callback(this.repository);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  findOneByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }

  async save(data: DeepPartial<User>, qr?: QueryRunner): Promise<User> {
    const source = qr ? qr.manager.getRepository(User) : this.repository;

    if (isNil(data.email)) {
      throw new BadRequestException({ reason: '이메일이 없습니다.' });
    }

    const user = await this.findOneByEmail(data.email);
    if (user) {
      throw new AlreadyExistsEmailException();
    }

    return source.save(data);
  }
}
