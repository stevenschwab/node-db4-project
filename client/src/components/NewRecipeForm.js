import React, { useState, useEffect } from 'react'
import axios from 'axios'

const initialIngredients = {
    ingredientId: '', 
    quantity: '', 
    unit: '' 
}

const initialSteps = {
    stepNumber: 1,
    stepInstructions: '',
    ingredients: [initialIngredients]
}

const NewRecipeForm = () => {
    const [ingredients, setIngredients] = useState([]);
    const [recipeName, setRecipeName] = useState('');
    const [steps, setSteps] = useState([initialSteps]);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get('http://localhost:9000/api/ingredients')
          .then(response => {
            setIngredients(response.data);
          })
          .catch(error => {
            console.error('Error fetching ingredients:', error);
          });
    }, [])

    const handleRecipeNameChange = (e) => {
        setRecipeName(e.target.value);
    };

    const handleStepChange = (index, field, value) => {
        const newSteps = [...steps];
        newSteps[index][field] = value;
        setSteps(newSteps);
    }

    const handleIngredientChange = (stepIndex, ingredientIndex, field, value) => {
        const newSteps = [...steps];
        newSteps[stepIndex].ingredients[ingredientIndex][field] = value;
        setSteps(newSteps);
    }

    const addStep = () => {
        setSteps([
            ...steps, 
            { 
                stepNumber: steps.length + 1, 
                stepInstructions: '', 
                ingredients: [initialIngredients] 
            }
        ]);
    };

    const addIngredient = (stepIndex) => {
        const newSteps = [...steps];
        newSteps[stepIndex].ingredients.push({ ingredientId: '', quantity: '', unit: '' });
        setSteps(newSteps);
    };

    const validateIngredients = () => {
        for (const step of steps) {
          for (const ingredient of step.ingredients) {
            const { ingredientId, quantity, unit } = ingredient;
            const isFilled = ingredientId || quantity || unit;
            const isComplete = ingredientId && quantity && unit;
    
            if (isFilled && !isComplete) {
              return false;
            }
          }
        }
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateIngredients()) {
            setError('All ingredient fields must be filled out or left completely empty.');
            return;
        }
      
        setError('');
    
        const newRecipe = {
          recipe_name: recipeName,
          steps: steps.map(step => ({
            step_number: step.stepNumber,
            step_instructions: step.stepInstructions,
            ingredients: step.ingredients.filter(ingredient => ingredient.ingredientId).map(ingredient => ({
              ingredient_id: parseInt(ingredient.ingredientId),
              quantity: parseFloat(ingredient.quantity),
              unit: ingredient.unit
            }))
          }))
        };
    
        axios.post('http://localhost:9000/api/recipes', newRecipe)
          .then(response => {
            console.log('Recipe added:', response.data);
          })
          .catch(error => {
            console.error('Error adding recipe:', error);
          });
    };
    
    return (
        <form onSubmit={handleSubmit}>
          {error && <div style={{ color: 'red' }}>{error}</div>}
          <div>
            <label>Recipe Name:</label>
            <input 
                type="text" 
                value={recipeName} 
                onChange={handleRecipeNameChange} 
                required 
            />
          </div>
          {steps.map((step, stepIndex) => (
            <div key={stepIndex}>
              <h4>Step {stepIndex + 1}</h4>
              <div>
                <label>Instructions:</label>
                <input
                  type="text"
                  value={step.stepInstructions}
                  onChange={(e) => handleStepChange(stepIndex, 'stepInstructions', e.target.value)}
                  required
                />
              </div>
              <div>
                <h5>Ingredients</h5>
                {step.ingredients.map((ingredient, ingredientIndex) => (
                  <div key={ingredientIndex}>
                    <select
                      value={ingredient.ingredientId}
                      onChange={(e) => handleIngredientChange(stepIndex, ingredientIndex, 'ingredientId', e.target.value)}
                    >
                      <option value="">Select Ingredient</option>
                      {ingredients.map(ing => (
                        <option 
                            key={ing.id} 
                            value={ing.id}
                        >
                            {ing.ingredient_name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      step="0.01"
                      value={ingredient.quantity}
                      onChange={(e) => handleIngredientChange(stepIndex, ingredientIndex, 'quantity', e.target.value)}
                      placeholder="Quantity"
                    />
                    <input
                      type="text"
                      value={ingredient.unit}
                      onChange={(e) => handleIngredientChange(stepIndex, ingredientIndex, 'unit', e.target.value)}
                      placeholder="Unit (e.g., cup, tbsp)"
                    />
                  </div>
                ))}
                <button type="button" onClick={() => addIngredient(stepIndex)}>Add Ingredient</button>
              </div>
            </div>
          ))}
          <button type="button" onClick={addStep}>Add Step</button>
          <button type="submit">Submit Recipe</button>
        </form>
    )
}

export default NewRecipeForm