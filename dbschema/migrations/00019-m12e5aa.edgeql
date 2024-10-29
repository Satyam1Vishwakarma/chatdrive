CREATE MIGRATION m12e5aakhts352j4nb3k6vdceq6wpk4627msuwmu5t3cza6ro4smlq
    ONTO m1vbayjdgqsw3uewb4auua4u7d5z33aao53tudnhkzw3yff56zsm4q
{
  ALTER TYPE default::Messages {
      ALTER LINK postedby {
          ON TARGET DELETE ALLOW;
      };
  };
};
