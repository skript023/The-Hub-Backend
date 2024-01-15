export default class response<T> {
    message: string;
    data: T | T[];
    success: boolean;

    json(): response<T> {
        const data = new response<T>();
        data.message = this.message;
        data.data = this.data;
        data.success = this.success;

        this.clear();

        return data;
    }

    private clear() {
        delete this.message;
        delete this.data;
        delete this.success;
    }
}
