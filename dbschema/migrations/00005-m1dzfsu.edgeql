CREATE MIGRATION m1dzfsu6jpgbdb4wkcudzvpc4tocqpldpfhuweey4wkeuqnpr5p4fa
    ONTO m1n62n4pzsof3qzbu2djsktrfejlj6zgav7oryshiavhczurs4qpna
{
  ALTER TYPE default::GroupServer {
      CREATE MULTI LINK account: default::Account;
      ALTER LINK messages {
          ON TARGET DELETE ALLOW;
      };
  };
};
