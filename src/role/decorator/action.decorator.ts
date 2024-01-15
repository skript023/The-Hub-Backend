import { Reflector } from '@nestjs/core';

export const Actions = Reflector.createDecorator<string>();
