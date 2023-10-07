export default class MiddlewareResolver {

    constructor(resolvables) {
        this.resolvables = resolvables || [];
    }

    static create(...args) {
        return new MiddlewareResolver(...args);
    }

    static async resolveOne(resolvable, args) {
        let result = false;

        try {
            result = await resolvable(...args);
        } catch (error) {
            throw new Error('Resolved with Error');
        }

        return result;
    };


    async resolveAll (...args) {
        const results = [];

        try {
            for (let i = 0; i < this.resolvables.length; i++) {
                results.push(
                    await MiddlewareResolver.resolveOne(this.resolvables[i], args)
                );
            }
        } catch (error) {
            console.error(error);
            return false;
        }

        return results.filter(result => result !== true).shift() ?? true;
    }
}