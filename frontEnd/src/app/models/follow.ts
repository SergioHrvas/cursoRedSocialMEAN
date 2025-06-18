import { User } from "./user";

export class Follow{
    constructor(
        public user: User,
        public followed: string,
        public created_at: String
    ){}

}