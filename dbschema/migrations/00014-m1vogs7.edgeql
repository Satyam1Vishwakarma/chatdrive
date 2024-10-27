CREATE MIGRATION m1vogs7fxbikdzcba2ryuhey4suzu6cnhalfxdrpo6o63jgl7mgqzq
    ONTO m1gp4cxki4jixse2nstzpjyxvsjgaf3rphvtvap3xao52qn2enremq
{
  ALTER TYPE default::Account {
      ALTER LINK joined {
          ON TARGET DELETE ALLOW;
      };
  };
  ALTER TYPE default::GroupServer {
      ALTER LINK messages {
          ON TARGET DELETE ALLOW;
      };
      ALTER LINK users {
          ON TARGET DELETE ALLOW;
      };
  };
};
