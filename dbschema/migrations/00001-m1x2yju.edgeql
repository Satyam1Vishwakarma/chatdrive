CREATE MIGRATION m1x2yjumghe2afhjvaptgcn4hzwptifgi44236f43eibal3i3mqbrq
    ONTO initial
{
  CREATE TYPE default::Account {
      CREATE PROPERTY avatar: std::bytes;
      CREATE PROPERTY name: std::str;
      CREATE PROPERTY password: std::str;
  };
  CREATE SCALAR TYPE default::messageno EXTENDING std::sequence;
  CREATE TYPE default::Messages {
      CREATE LINK postedby: default::Account;
      CREATE PROPERTY data: std::str;
      CREATE PROPERTY position: default::messageno {
          CREATE CONSTRAINT std::exclusive;
      };
  };
  CREATE TYPE default::GroupServer {
      CREATE MULTI LINK messages: default::Messages;
      CREATE PROPERTY image: std::bytes;
      CREATE PROPERTY name: std::str;
  };
  ALTER TYPE default::Account {
      CREATE MULTI LINK joined: default::GroupServer;
  };
};
