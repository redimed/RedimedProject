//
//  rteleCollectionViewCell.m
//  telehealth
//
//  Created by Olivier Voyer on 23/10/13.
//  Copyright (c) 2013 REDiMED. All rights reserved.
//

#import "rteleCollectionViewCell.h"

@implementation rteleCollectionViewCell

- (id)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        // Initialization code
    }
    return self;
}

/*
// Only override drawRect: if you perform custom drawing.
// An empty implementation adversely affects performance during animation.
- (void)drawRect:(CGRect)rect
{
    // Drawing code
}
*/

- (void)awakeFromNib {
    [super awakeFromNib];
    UIView *selectedBG = [[UIView alloc] initWithFrame:[self.contentView bounds]];
    [selectedBG setBackgroundColor:[UIColor lightGrayColor]];
    [self setSelectedBackgroundView:selectedBG];
}

- (void)setSelected:(BOOL)selected {
    [super setSelected:selected];
}

@end
