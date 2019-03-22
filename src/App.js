import React, { Component, PureComponent } from 'react';
import { connect } from 'react-redux'
import InfiniteScroll from 'react-infinite-scroller';
import './App.css';

class ItemDisplay extends PureComponent
{
  render() {
    const { title } = this.props;
    const imagesrc = `//via.placeholder.com/90x90.png?text=${title}`;
    return <li><div>{title}
      <img alt={title} src={imagesrc} />
    </div></li>
  }
}

class App extends Component {

  loadMoreItems = (page) => {
    console.log("loading more", page);
    if (!this.props.isFetching)
      this.props.loadMore(page);
    else;
      console.log("waiting on previous fetch to complete first")
  }

  render() {
    const { items } = this.props;
    return (
      <div className="App">
        <InfiniteScroll
          initialLoad={false}
          pageStart={0}
          loadMore={this.loadMoreItems}
          hasMore={true}        
          loader={<div className="loader" key={0}>Loading ...</div>}
        >
          <ul>
            {items.map(item => {
              return <ItemDisplay key={item.id} title={item.title} />
            })}
          </ul>
        </InfiniteScroll>
      </div>
    );
  }
}
const mapStateToProps = state => {
  //console.log("state", state)
  return {
    items: state.items,
    isFetching: state.isFetching
  }
}

const mapDispatchToProps = dispatch => ({
  loadMore: (page) => dispatch({
    type: 'LOAD_MORE',
    payload: page
  })
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)