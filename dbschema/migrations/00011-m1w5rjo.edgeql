CREATE MIGRATION m1w5rjohjkn4xy7yf46myyeihnvat7y7a7pal5mq5pnjtsjgyxmvra
    ONTO m1iwtbzk6k7lleefglz55obukrkvohw4u7cpe5djzynbqqzlo5jfkq
{
  ALTER TYPE default::Users {
      ALTER PROPERTY name {
          RENAME TO username;
      };
  };
};
