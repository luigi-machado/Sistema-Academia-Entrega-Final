import React, { useState } from 'react';
import axios from 'axios';
import '../Assets/Forms.css'


const Forms = ({ fields, submitUrl }) => {
    const [formData, setFormData] = useState({});

    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      // Se for um checkbox, usa o valor "checked". Caso contrário, usa "value".
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post(submitUrl, formData);
        console.log('Formulário enviado com sucesso:', response.data);
      } catch (error) {
        console.error('Erro ao enviar formulário:', error);
      }
    };
  
    const renderInput = (field) => {
        switch (field.type) {
          case 'text':
          case 'password':
          case 'email':
          case 'date':
          case 'tel':
          case 'number':
            return (
              <input
                type={field.type}
                id={field.name}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                placeholder={field.placeholder || ''}
              />
            );
          case 'checkbox':
            return (
              <input
                type="checkbox"
                id={field.name}
                name={field.name}
                checked={formData[field.name] || false}
                onChange={handleChange}
              />
            );
          case 'select':
            console.log("Options: " , field)
            return (
              <select
                id={field.name}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
              >
                {field.options.map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            );
          default:
            return null;
        }
      };
  
    return (
      <form className="generic-form" onSubmit={handleSubmit}>
        {fields.map((field, index) => (
          <div key={index}>
            <label htmlFor={field.name}>{field.label}:{renderInput(field)}</label>
            
          </div>
        ))}
        <button type="submit">Enviar</button>
      </form>
    );
  };

  
  export default Forms;