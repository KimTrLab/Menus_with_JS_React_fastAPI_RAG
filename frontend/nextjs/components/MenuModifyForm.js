'use client';

import { useState } from "react";

export default function MenuModifyForm({ initialData, onSave }) {
    const [name, setName] = useState(initialData.name);
    const [calories, setCalories] = useState(initialData.calories);
    const [description, setDescription] = useState(initialData.description);

    function handleSubmit(event) {
        event.preventDefault();
        const menuObject = {
            id: initialData.id,
            name,
            calories: Number(calories),
            description
        };
        onSave(menuObject);
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="name">메뉴 이름:</label>
                <input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="calories">칼로리:</label>
                <input
                    id="calories"
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="description">설명:</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            <button type="submit">저장</button>
        </form>
    );
}