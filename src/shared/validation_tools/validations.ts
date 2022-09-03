export function belongsTo(object: any, array: Array<any>) {
    let objectInArray = array.find(i => i.id === object.id);
    return objectInArray !== undefined
}