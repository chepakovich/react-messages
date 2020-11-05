import React, { Component } from 'react'
import { messages } from '../data.json'

const uniqueMessages = messages.filter((v, i, a) => a.findIndex(t => (t.uuid === v.uuid && t.content === v.content)) === i)

export default class Messages extends Component {
  constructor(props) {
    super(props)
    this.state = {
      messagesAll: uniqueMessages,
      currentPage: 1,
      msgsPerPage: 5,
      ordered: ''
    }
  }

  onDelete = (indexOfFirstMsg, index) => {
    console.log("delete:", indexOfFirstMsg, index)
    const msgIndex = indexOfFirstMsg + index
    const messagesNew = [...this.state.messagesAll]
    messagesNew.splice(msgIndex, 1)
    this.setState({ messagesAll: messagesNew })
  }

  onPageClick = (event) => {
    this.setState({ currentPage: Number(event.target.id) })
  }

  sortMessages = (order) => {
    const messagesNew = [...this.state.messagesAll]
    if (order === "asc") {
      messagesNew.sort((a, b) => (a.sentAt > b.sentAt) ? 1 : -1)
    }
    if (order === "des") {
      messagesNew.sort((a, b) => (a.sentAt < b.sentAt) ? 1 : -1)
    }
    this.setState({
      messagesAll: messagesNew,
      ordered: order
    })
  }

  render() {
    const { messagesAll, currentPage, msgsPerPage, ordered } = this.state

    const indexOfLastMsg = currentPage * msgsPerPage;
    const indexOfFirstMsg = indexOfLastMsg - msgsPerPage;
    const currentMessages = messagesAll.slice(indexOfFirstMsg, indexOfLastMsg);
    const renderMessages = currentMessages.map((item, index) => {
      const d = new Date(item.sentAt);
      return (
        <tr key={index}>
          <td>{item.content}</td>
          <td>{item.senderUuid}</td>
          <td>{d.toDateString()} at {d.toLocaleTimeString()}</td >
          <td><button onClick={() => this.onDelete(indexOfFirstMsg, index)}>delete</button></td >
        </tr>
      )
    })

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(messagesAll.length / msgsPerPage); i++) {
      pageNumbers.push(i);
    }
    const renderPageNumbers = pageNumbers.map(number => {
      return (
        <li key={number} id={number} onClick={this.onPageClick}>
          {number}
        </li>
      )
    })

    return (
      <div>
        <h1>Messages</h1>
        {messagesAll.length > 0 ?
          <div>
            <table className="messages">
              <thead>
                <tr>
                  <td>Content</td>
                  <td>Sender</td>
                  <td>
                    Sent at
                    {ordered === 'asc' ? null
                      : <button className="sort" onClick={() => this.sortMessages('asc')}>&#9650;</button>}
                    {ordered === 'des' ? null
                      : <button className="sort" onClick={() => this.sortMessages('des')}>&#9660;</button>}
                  </td>
                  <td>&nbsp;</td>
                </tr>
              </thead>
              <tbody>
                {renderMessages}
              </tbody>
            </table>
            <p>Pages </p>
            <div className="nav">
              <ul className="page-numbers">
                {renderPageNumbers}
              </ul>
            </div>
          </div>
          : <p>There are no messages</p>}
      </div>
    )
  }
}
