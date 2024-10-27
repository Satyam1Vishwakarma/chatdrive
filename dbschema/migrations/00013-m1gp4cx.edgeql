CREATE MIGRATION m1gp4cxki4jixse2nstzpjyxvsjgaf3rphvtvap3xao52qn2enremq
    ONTO m1bjbbihjwlkvyszmspgwg7rlfl53husnkrsvurm7cwy6z2ppyruia
{
  ALTER TYPE default::Account {
      ALTER LINK joined {
          ON TARGET DELETE DELETE SOURCE;
      };
  };
  ALTER TYPE default::GroupServer {
      ALTER LINK messages {
          ON TARGET DELETE DELETE SOURCE;
      };
  };
};
