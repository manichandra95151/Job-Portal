
import express from 'express';

export const users = [
    { id: 1, name: "vivek", email: "krvivi28@gmail.com", password: "vivek28@" },
    {
        id: 2, name: "mani", email: "manichandra9151@gmail.com", password: "123456"
    }

];


export const addUser = (user) => {
    const id = users.length + 1;
    user.id = id;
    users.push(id, user);
    console.log(users);
}
