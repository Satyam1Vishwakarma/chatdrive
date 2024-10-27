CREATE MIGRATION m1n62n4pzsof3qzbu2djsktrfejlj6zgav7oryshiavhczurs4qpna
    ONTO m1hg32cmif7whuloupc4xebx4rzdz6d7sm26b4wzl2fojej3uri77q
{
  ALTER TYPE default::Account {
      ALTER LINK joined {
          ON TARGET DELETE ALLOW;
      };
  };
};
