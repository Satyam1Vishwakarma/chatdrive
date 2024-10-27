CREATE MIGRATION m1hg32cmif7whuloupc4xebx4rzdz6d7sm26b4wzl2fojej3uri77q
    ONTO m1uuiivu7twe6sd3rwh3wwxdomcjfdmrx42yloeakm4hcjkbdx4lna
{
  ALTER TYPE default::Account {
      ALTER PROPERTY name {
          DROP CONSTRAINT std::exclusive;
      };
  };
};
