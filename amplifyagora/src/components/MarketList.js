import React from 'react';
import { graphqlOperation } from 'aws-amplify';
import { Connect } from 'aws-amplify-react';
import { listMarkets } from '../graphql/queries';
import { onCreateMarket } from '../graphql/subscriptions';
import Error from './Error';
import { Loading, Card, Icon, Tag } from 'element-react';
import { Link } from 'react-router-dom';

const MarketList = () => {
  const onNewMarket = (prevQuery, newData) => {
    let updatedQuery = { ...prevQuery };
    const updatedMarketList = [
      newData.onCreateMarket,
      ...prevQuery.listMarkets.items,
    ];
    updatedQuery.listMarkets.items = updatedMarketList;
    return updatedQuery;
  };
  return (
    <Connect
      query={graphqlOperation(listMarkets)}
      subscription={graphqlOperation(onCreateMarket)}
      onSubscriptionMsg={onNewMarket}
    >
      {({ data, loading, errors }) => {
        if (errors.length > 0) return <Error errors={errors} />;
        if (loading || !data.listMarkets) return <Loading fullscreen={true} />;
        return (
          <>
            <h2 className="header">
              <img
                src="https://icon.now.sh/store_mall_directory/527FF"
                alt="Store Icon"
                className="large-icon"
              />
              Markets
            </h2>
            {data.listMarkets.items.map(market => {
              console.log(market);
              return (
                <div className="my-2" key={market.id}>
                  <Card
                    bodyStyle={{
                      padding: '0.7em',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <span className="flex">
                        <Link className="link" to={`/markets/${market.id}`}>
                          {market.name}
                        </Link>
                        <span style={{ color: 'var(--darkAmazonOrange)' }}>
                          {market.products.items &&
                            market.products.items.length}
                        </span>
                        <img
                          src="https://icon.now.sh/shopping_cart/f60"
                          alt="shopping"
                        />
                      </span>
                      <div style={{ color: 'var(--lightSquidInk)' }}>
                        {market.owner}
                      </div>
                    </div>
                    <div>
                      {market.tags &&
                        market.tags.map(tag => (
                          <Tag className="mx-1" type="danger" key={tag}>
                            {tag}
                          </Tag>
                        ))}
                    </div>
                  </Card>
                </div>
              );
            })}
          </>
        );
      }}
    </Connect>
  );
};

export default MarketList;
