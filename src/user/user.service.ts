import { Injectable } from '@nestjs/common';
import { User } from './user';

@Injectable()
export class UserService {
  private users: User[] = [
    new User(1, 'admin', '123456', ['admin']),
    new User(2, 'usuarioConsultorTodos', '123456', ['consultorTodos']),
    new User(3, 'usuarioConsultorCultura', '123456', ['consultorCultura']),
    new User(4, 'usuarioEscritor', '123456', ['consultorTodos', 'escritor']),
    new User(5, 'usuarioEliminador', '123456', [
      'consultorTodos',
      'eliminador',
    ]),
    new User(6, 'usuarioConsultorReceta', '123456', ['consultorReceta']),
    new User(7, 'usuarioConsultorProducto', '123456', ['consultorProducto']),
    new User(8, 'usuarioConsultorCategoria', '123456', ['consultorCategoria']),
    new User(9, 'usuarioConsultorPais', '123456', ['consultorPais']),
    new User(10, 'usuarioConsultorCiudad', '123456', ['consultorCiudad']),
    new User(11, 'usuarioConsultorEstrellaMichelin', '123456', [
      'consultorEstrellaMichelin',
    ]),
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }
}
