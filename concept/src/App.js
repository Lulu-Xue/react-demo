import React, { Component } from 'react';
import './App.css';

var PRODUCTS = [
  { category: "Sporting Goods", price: "$49.99", stocked: true, name: "Football" },
  { category: "Sporting Goods", price: "$9.99", stocked: true, name: "Baseball" },
  { category: "Sporting Goods", price: "$29.99", stocked: false, name: "Basketball" },
  { category: "Electronics", price: "$99.99", stocked: true, name: "iPod Touch" },
  { category: "Electronics", price: "$399.99", stocked: false, name: "iPhone 5" },
  { category: "Electronics", price: "$199.99", stocked: true, name: "Nexus 7" }
];

class FilterableProductTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterText: '',
      inStockOnly: false,
    }
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
  }
  handleSearchChange(value){
    this.setState({
      filterText: value
    })
  }
  handleCheckboxChange(value){
    this.setState({
      inStockOnly: value
    })
  }
  render() {
    let categorys = [];
    let rows = [];
    this.props.products.forEach(function (product, index, oldArr) {
      if (product.name.indexOf(this.state.filterText) === -1 || (this.state.inStockOnly && !product.stocked)) {
        return;
      }
      if (categorys.includes(product.category)) {
        rows.push(<ProductRow product={product} key={product.name} />);
      } else {
        categorys.push(product.category);
        rows.push(<ProductCategoryRow category={product.category} key={product.category} />);
        rows.push(<ProductRow product={product} key={product.name} />)
      }
    },this)
    return (
      <div>
        <SearchBar filterText={this.state.filterText} inStockOnly={this.state.inStockOnly} onSearchChange={this.handleSearchChange} onCheckboxChange={this.handleCheckboxChange}/>
        <ProductTable>
          {rows}
        </ProductTable>
      </div>
    )
  }
}

class SearchBar extends Component {
  constructor(props){
    super(props);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
  }
  handleSearchChange(e){
    this.props.onSearchChange(e.target.value);
  }
  handleCheckboxChange(e){
    this.props.onCheckboxChange(e.target.checked);
  }
  render() {
    return (
      <div>
        <input type="text" placeholder="Search..." value={this.props.filterText} onChange={this.handleSearchChange} />
        <p>
          <input type="checkbox" checked={this.props.inStockOnly} onChange={this.handleCheckboxChange} />Only show products in stock
        </p>
      </div>
    )
  }
}

class ProductTable extends Component {
  render() {
    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>{this.props.children}</tbody>
      </table>
    )
  }
}

class ProductCategoryRow extends Component {
  render() {
    return (
      <tr>
        <td colSpan="2">{this.props.category}</td>
      </tr>
    )
  }
}

class ProductRow extends Component {
  render() {
    return (
      <tr>
        <td>{this.props.product.stocked ? this.props.product.name : <span style={{ color: 'red' }}>{this.props.product.name}</span>}</td>
        <td>{this.props.product.price}</td>
      </tr>
    )
  }
}

class App extends Component {
  render() {
    return (
      <FilterableProductTable className="App" products={PRODUCTS} />
    );
  }
}

export default App;
