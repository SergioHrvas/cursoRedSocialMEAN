export class Message{
    constructor(
        public emmiter: String,
        public receiver: String,
        public viewed: Boolean,
        public text: String,
        public file: String,
        public created_at: String
    ){}

}