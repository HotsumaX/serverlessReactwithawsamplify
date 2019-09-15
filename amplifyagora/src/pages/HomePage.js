import React from 'react';
import NewMarket from '../components/NewMarket';
import MarketList from '../components/MarketList';

class HomePage extends React.Component {
  state = {
    searchTerm: '',
    searchResults: [],
    isSearching: false,
  };

  handleSearchChange = searchTerm => this.setState({ searchTerm });

  handleClearSearch = () =>
    this.setState({ searchTerm: '', searchResults: [] });

  handleSearch = event => {
    event.preventDefault();
    console.log(this.state.searchTerm);
    //adding notes
  };

  render() {
    return (
      <>
        <NewMarket
          searchTerm={this.state.searchTerm}
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
