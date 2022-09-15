import { Injectable } from '@nestjs/common';
import { User } from './user';

@Injectable()
export class UserService {
   private users: User[] = [
       new User(1, "admin", "123456", ["admin"]),
       new User(2, "usuarioConsultorTodos", "123456", ["consultorTodos"]),
       new User(3, "usuarioConsultorCultura", "123456", ["consultorCultura"]),
       new User(4, "usuarioEscritor", "123456", ["consultorTodos", "escritor"]),
       new User(5, "usuarioEliminador", "123456", ["consultorTodos", "eliminador"]),
   ];

   async findOne(username: string): Promise<User | undefined> {
       return this.users.find(user => user.username === username);
   }
}
