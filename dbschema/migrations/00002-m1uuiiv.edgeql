CREATE MIGRATION m1uuiivu7twe6sd3rwh3wwxdomcjfdmrx42yloeakm4hcjkbdx4lna
    ONTO m1x2yjumghe2afhjvaptgcn4hzwptifgi44236f43eibal3i3mqbrq
{
  ALTER TYPE default::Account {
      ALTER PROPERTY name {
          CREATE CONSTRAINT std::exclusive;
      };
  };
};
