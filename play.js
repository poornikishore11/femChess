let user = { name: "John" };

let permission1 = { canView: true };
let permission2 = { canEdit: true };

Object.assign(user, permission1, permission2);

console.log(user.name);
console.log(user.canView);
console.log(user.canEdit);
structuredClone(object);
//in objects methods are assigned
