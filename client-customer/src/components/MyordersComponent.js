import axios from 'axios';
import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import MyContext from '../contexts/MyContext';

class Myorders extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      order: null
    };
  }
  render() {
    if (this.context.token === '') return (<Navigate replace to='/login' />);
    const orders = this.state.orders.map((item) => {
      return (
        <tr key={item._id} className="table-result" onClick={() => this.trItemClick(item)}>
          <td>{item._id}</td>
          <td>{new Date(item.cdate).toLocaleString()}</td>
          <td>{item.customer.name}</td>
          <td>{item.customer.phone}</td>
          <td>{item.total}</td>
          <td>{item.status}</td>
        </tr>
      );
    });
    if (this.state.order) {
      var items = this.state.order.items.map((item, index) => {
        return (
          <tr key={item.product._id} className="table-result">
            <td>{index + 1}</td>
            <td>{item.product._id}</td>
            <td>{item.product.name}</td>
            <td><img src={"data:image/jpg;base64," + item.product.image} width="70px" height="70px" alt="" /></td>
            <td>{item.product.price}</td>
            <td>{item.quantity}</td>
            <td>{item.product.price * item.quantity}</td>
          </tr>
        );
      });
    }
    return (
      <div>
        <div className="page">
          <h2 className="label">DANH SÁCH ĐƠN HÀNG</h2>
          <table className="table" border="1">
            <tr className="table-database">
              <th>ID</th>
              <th>Ngày tạo</th>
              <th>Cust.name</th>
              <th>Cust.phone</th>
              <th>Tổng cộng</th>
              <th>Trạng thái</th>
            </tr>
            {orders}
          </table>
        </div>
        {this.state.order ?
          <div className="page">
            <h2 className="label">CHI TIẾT ĐƠN HÀNG</h2>
            <table className="table" border="1">
              <tr className="table-database">
                <th>No.</th>
                <th>Prod.ID</th>
                <th>Prod.name</th>
                <th>Hình ảnh</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Tổng</th>
              </tr>
              {items}
            </table>
          </div>
          : <div />}
      </div>
    );
  }
  componentDidMount() {
    if (this.context.customer) {
      const cid = this.context.customer._id;
      this.apiGetOrdersByCustID(cid);
    }
  }
  // event-handlers
  trItemClick(item) {
    this.setState({ order: item });
  }
  // apis
  apiGetOrdersByCustID(cid) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/customer/orders/customer/' + cid, config).then((res) => {
      const result = res.data;
      this.setState({ orders: result });
    });
  }
}
export default Myorders;
