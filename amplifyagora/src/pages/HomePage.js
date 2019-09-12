import React from 'react';
import NewMarket from '../components/NewMarket';
import MarketList from '../components/MarketList';

class HomePage extends React.Component {
  state = {
    seachTerm: '',
    searchResults: [],
    isSearching: false,
  };

  handleSearchChange = searchTerm => this.setState({ searchTerm });

  handleClearSearch = () =>
    this.setState({ searchTerm: '', searchResults: [] });

  handleSearch = event => {
    event.preventDefault();
    console.log(this.state.searchTerm);
  };

  render() {
    return (
      <>
        <NewMarket
          searchTerm={this.state.seachTerm}
          isSearching={this.state.handleSearch}
          handleSearchChange={this.handleSearchChange}
          handleClearSearch={this.handleClearSearch}
          handleSearch={this.handleSearch}
        />
        <MarketList />
      </>
    );
  }
}

export default HomePage;
