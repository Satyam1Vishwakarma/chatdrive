CREATE MIGRATION m1iwtbzk6k7lleefglz55obukrkvohw4u7cpe5djzynbqqzlo5jfkq
    ONTO m1ttv4nr2dhw7xrpyvah6nnwhljmaqxzxjfeh44clfdcgu3xp5gs7a
{
  ALTER TYPE default::Users {
      ALTER PROPERTY canread {
          SET TYPE std::str USING (<std::str>.canread);
      };
  };
};
