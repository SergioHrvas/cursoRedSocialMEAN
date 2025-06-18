import { User } from "./user";

export class Message{
    constructor(
        public emitter: User,
        public receiver: User,
        public viewed: Boolean,
        public text: String,
        public file: String,
        public created_at: string
    ){}

}