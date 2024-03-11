const resolvers = {
    Query: {
      // Get the current user
      me: async (parent, args, context) => {
        if (context.user) {
          const userData = await User.findOne({ _id: context.user._id })
            .select('-__v -password')
            .populate('savedBooks');
          return userData;
        }
        throw new Error('Not logged in');
      },
    },
    Mutation: {
      // User login
      login: async (parent, { email, password }) => {
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error('Incorrect credentials');
        }
        const correctPw = await user.isCorrectPassword(password);
        if (!correctPw) {
          throw new Error('Incorrect credentials');
        }
        const token = signToken(user);
        return { token, user };
      },
      // Add a user
      addUser: async (parent, args) => {
        const user = await User.create(args);
        const token = signToken(user);
        return { token, user };
      },
      // Save a book
      saveBook: async (parent, { input }, context) => {
        if (context.user) {
          const updatedUser = await User.findByIdAndUpdate(
            { _id: context.user._id },
            { $push: { savedBooks: input } },
            { new: true }
          );
          return updatedUser;
        }
        throw new Error('You need to be logged in!');
      },
      // Remove a book
      removeBook: async (parent, { bookId }, context) => {
        if (context.user) {
          const updatedUser = await User.findByIdAndUpdate(
            { _id: context.user._id },
            { $pull: { savedBooks: { bookId } } },
            { new: true }
          );
          return updatedUser;
        }
        throw new Error('You need to be logged in!');
      },
    },
  };
  