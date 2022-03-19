//turn function into a promise
const promisify = (fn) => new Promise((resolve, reject) => fn(resolve));

module.exports = {
    promisify: promisify  
}
