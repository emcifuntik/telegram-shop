const Form = require('./formBuilder');

const Templates = {};

const CommonTemplate = `<div class="form-group"><label><%= title %></label><%- template %></div>`

Templates[Form.Type.Text.Single] = `
<input class="form-control" 
name="<%= name %>" 

<% if(placeholder) { %>
placeholder="<%= placeholder %>" 
<% } %>

<% if(value) { %>
value="<%= value %>"
<% } %>

>`;

Templates[Form.Type.Text.Multi] = `<textarea class="form-control" name="<%= name %>" rows="3" placeholder="<%= placeholder %>"><%= value %></textarea>`;

Templates[Form.Type.Number.Integer] = `<input class="form-control" name="<%= name %>" type="number" placeholder="<%= placeholder %>">`;

Templates[Form.Type.Number.Float] = `<input class="form-control" name="<%= name %>" type="number" placeholder="<%= placeholder %>">`;

Templates[Form.Type.Number.DateOnly] = ``;

Templates[Form.Type.Number.TimeOnly] = ``;

Templates[Form.Type.Number.DateTime] = ``;

Templates[Form.Type.Select.Single] = `<select name="<%= name %> class="form-control">
<option selected disabled>Сделайте выбор</option>
<% for(let options of options) { %>
    <option value="<%= option.value %>"><%= option.title %></option>
<% } %>
</select>`;

Templates[Form.Type.Select.Multi] = `<select multiple name="<%= name %> class="form-control">
<option selected disabled>Сделайте выбор</option>
<% for(let options of options) { %>
    <option value="<%= option.value %>"><%= option.title %></option>
<% } %>
</select>`;