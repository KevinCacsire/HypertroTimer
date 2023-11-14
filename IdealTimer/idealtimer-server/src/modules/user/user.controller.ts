import { Controller, Param, Delete} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Delete(':userId')
    async deleteUser(
        @Param('userId') userId: string,
    ) : Promise<void> {
        await this.userService.deleteUser(userId);
    }
}