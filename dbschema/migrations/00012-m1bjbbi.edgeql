CREATE MIGRATION m1bjbbihjwlkvyszmspgwg7rlfl53husnkrsvurm7cwy6z2ppyruia
    ONTO m1w5rjohjkn4xy7yf46myyeihnvat7y7a7pal5mq5pnjtsjgyxmvra
{
  ALTER TYPE default::GroupServer {
      ALTER LINK users {
          ON TARGET DELETE DELETE SOURCE;
      };
  };
};
