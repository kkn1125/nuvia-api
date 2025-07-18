import { ApiProperty } from '@nestjs/swagger';

export class CreateJwtResponseDto {
  @ApiProperty({
    description: '액세스 토큰',
    type: String,
  })
  token!: string;

  @ApiProperty({
    description: '리프레시 토큰',
    type: String,
  })
  refresh!: string;
}
